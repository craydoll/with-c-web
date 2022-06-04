import torch 
import torch.nn as nn
from torch.autograd import Variable
import numpy as np
import cv2 
from util import * 
import argparse
from darknet import Darknet
from preprocess import prep_image

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import firebase_admin
from firebase_admin import storage
import datetime

credFilePath = "with-c-web-firebase-adminsdk-9r14y-e386503712.json"
cred = credentials.Certificate(credFilePath)
default_app = firebase_admin.initialize_app(cred)

bucket = storage.bucket("with-c-web-firebase-adminsdk-9r14y-e386503712.json", default_app)
blob1 = bucket.blob("image/screen")
blob2 = bucket.blob("yolov3.weights")

bytes_data1 = blob1.download_as_bytes()
bytes_data2 = blob2.download_as_bytes()

img_buf = np.frombuffer(bytes_data1, dtype=np.uint8)
import_img = cv2.imdecode(img_buf, cv2.IMREAD_UNCHANGED)
import_img = np.delete(import_img, 3, 2)

class test_net(nn.Module):
    def __init__(self, num_layers, input_size):
        super(test_net, self).__init__()
        self.num_layers= num_layers
        self.linear_1 = nn.Linear(input_size, 5)
        self.middle = nn.ModuleList([nn.Linear(5,5) for x in range(num_layers)])
        self.output = nn.Linear(5,2)
    
    def forward(self, x):
        x = x.view(-1)
        fwd = nn.Sequential(self.linear_1, *self.middle, self.output)
        return fwd(x)
        
def get_test_input(input_dim, CUDA):
    # img = cv2.imread("tmp.png")
    img = cv2.resize(import_img, (input_dim, input_dim)) 
    img_ =  img[:,:,::-1].transpose((2,0,1))
    img_ = img_[np.newaxis,:,:,:]/255.0
    img_ = torch.from_numpy(img_).float()
    img_ = Variable(img_)
    
    if CUDA:
        img_ = img_.cuda()
    #num_classes
    return img_

def arg_parse():
    """
    Parse arguements to the detect module

    """
    
    parser = argparse.ArgumentParser(description='YOLO v3 Detection Module')
   
    parser.add_argument("--images", dest = 'images', help = 
                        "Image / Directory containing images to perform detection upon",
                        default = bytes_data1, type = str)
    parser.add_argument("--bs", dest = "bs", help = "Batch size", default = 1)
    parser.add_argument("--confidence", dest = "confidence", help = "Object Confidence to filter predictions", default = 0.5)
    parser.add_argument("--nms_thresh", dest = "nms_thresh", help = "NMS Threshhold", default = 0.4)
    parser.add_argument("--cfg", dest = 'cfgfile', help = 
                        "Config file",
                        default = "yolov3.cfg", type = str)
    parser.add_argument("--weights", dest = 'weightsfile', help = 
                        "weightsfile",
                        default = bytes_data2, type = str)
    parser.add_argument("--reso", dest = 'reso', help = 
                        "Input resolution of the network. Increase to increase accuracy. Decrease to increase speed",
                        default = "416", type = str)
    parser.add_argument("--scales", dest = "scales", help = "Scales to use for detection",
                        default = "1,2,3", type = str)
    
    return parser.parse_args()

def hello_python(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    if request.args and 'message' in request.args:
        return request.args.get('message')
    elif request_json and 'message' in request_json:
        return request_json['message']
    else:   
        args = arg_parse()

        scales = args.scales


        images = args.images
        batch_size = int(args.bs)
        confidence = float(args.confidence)
        nms_thesh = float(args.nms_thresh)
        start = 0

        CUDA = torch.cuda.is_available()

        num_classes = 80
        classes = load_classes('coco.names') 

        #Set up the neural network
        print("Loading network.....")
        model = Darknet(args.cfgfile)
        model.load_weights(bytes_data2)
        print("Network successfully loaded")

        model.net_info["height"] = args.reso
        inp_dim = int(model.net_info["height"])
        assert inp_dim % 32 == 0 
        assert inp_dim > 32

        #If there's a GPU availible, put the model on GPU
        if CUDA:
            model.cuda()


        #Set the model in evaluation mode
        model.eval()

        #read_dir = time.time()
        #Detection phase

        imlist = ['IMGP1868.JPG']
        # load_batch = time.time()

        batches = list(map(prep_image, [import_img], [inp_dim]))
        im_batches = [x[0] for x in batches]
        orig_ims = [x[1] for x in batches]
        im_dim_list = [x[2] for x in batches]
        im_dim_list = torch.FloatTensor(im_dim_list).repeat(1,2)



        if CUDA:
            im_dim_list = im_dim_list.cuda()

        leftover = 0

        if (len(im_dim_list) % batch_size):
            leftover = 1
            
            
        if batch_size != 1:
            num_batches = len(imlist) // batch_size + leftover            
            im_batches = [torch.cat((im_batches[i*batch_size : min((i +  1)*batch_size,
                                len(im_batches))]))  for i in range(num_batches)]        


        i = 0


        write = False
        model(get_test_input(inp_dim, CUDA), CUDA)

        # start_det_loop = time.time()

        objs = {}



        for batch in im_batches:
            #load the image 
            # start = time.time()
            if CUDA:
                batch = batch.cuda()
            

            #Apply offsets to the result predictions
            #Tranform the predictions as described in the YOLO paper
            #flatten the prediction vector 
            # B x (bbox cord x no. of anchors) x grid_w x grid_h --> B x bbox x (all the boxes) 
            # Put every proposed box as a row.
            with torch.no_grad():
                prediction = model(Variable(batch), CUDA)
            
        #        prediction = prediction[:,scale_indices]

            
            #get the boxes with object confidence > threshold
            #Convert the cordinates to absolute coordinates
            #perform NMS on these boxes, and save the results 
            #I could have done NMS and saving seperately to have a better abstraction
            #But both these operations require looping, hence 
            #clubbing these ops in one loop instead of two. 
            #loops are slower than vectorised operations. 
            
            prediction = write_results(prediction, confidence, num_classes, nms = True, nms_conf = nms_thesh)
            
            
            if type(prediction) == int:
                i += 1
                continue

            #end = time.time()
            
                        
        #        print(end - start)

                

            prediction[:,0] += i*batch_size
            

                
                
            if not write:
                output = prediction
                write = 1
            else:
                output = torch.cat((output,prediction))
                
            
            

            for im_num, image in enumerate(imlist[i*batch_size: min((i +  1)*batch_size, len(imlist))]):
                im_id = i*batch_size + im_num
                objs = [classes[int(x[-1])] for x in output if int(x[0]) == im_id]
                # print("{0:20s} predicted in {1:6.3f} seconds".format(image.split("/")[-1], (end - start)/batch_size))
                print("{0:20s} {1:s}".format("Objects Detected:", " ".join(objs)))
                print("----------------------------------------------------------")

                con_param = 0
                for item in objs:
                    if item == "person":
                        con_param = 1

                db = firestore.client()
                users = db.collection('test6_records')
                docs = users.stream()

                doc_ref = db.collection('test6_records').document()
                doc_ref.set({
                    'name':'kaisei',
                    'start_date':datetime.datetime.now(),
                    'concentration':con_param,
                    'subject':'Math'
                })
                print("data was sent")
            i += 1

            
            if CUDA:
                torch.cuda.synchronize()

        try:
            output
        except NameError:
            print("No detections were made")
            exit()
            
        im_dim_list = torch.index_select(im_dim_list, 0, output[:,0].long())

        scaling_factor = torch.min(inp_dim/im_dim_list,1)[0].view(-1,1)


        output[:,[1,3]] -= (inp_dim - scaling_factor*im_dim_list[:,0].view(-1,1))/2
        output[:,[2,4]] -= (inp_dim - scaling_factor*im_dim_list[:,1].view(-1,1))/2



        output[:,1:5] /= scaling_factor

        for i in range(output.shape[0]):
            output[i, [1,3]] = torch.clamp(output[i, [1,3]], 0.0, im_dim_list[i,0])
            output[i, [2,4]] = torch.clamp(output[i, [2,4]], 0.0, im_dim_list[i,1])
            
            
        #output_recast = time.time()


        #class_load = time.time()

        # colors = pkl.load(open("pallete", "rb"))


        #draw = time.time()

        torch.cuda.empty_cache()
        return 'Send data'
