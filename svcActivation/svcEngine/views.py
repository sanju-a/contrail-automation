from django.http import HttpResponse
import management.commands.serviceInstance

from django.core.context_processors import csrf
from django.shortcuts import render_to_response

def miAaas(request):
    config = request.GET.get('config')
    oper = request.GET.get('operation')
    
    if config is None:
        return HttpResponse("Config file not provided")
    else:
        conf = "-c %s" % (config)
        
    if oper is None:
        return HttpResponse("Operation (add/del) not specified") 
    else:
        op = "--operation %s" % (oper)   
    
    args = ("%s %s") % (conf, op)
       
    status = management.commands.serviceInstance.initialize(args)
    return HttpResponse("Status:: %s" % (status))

def miAaasCancel(request):
    config = request.GET.get('config')
    oper = request.GET.get('operation')
    
    if config is None:
        return HttpResponse("Config file not provided")
    else:
        conf = "-c %s" % (config)
    
    if oper is None:
        return HttpResponse("Operation (add/del) not specified") 
    else:
        op = "--operation %s" % (oper)   
        
    args = ("%s %s") % (conf, op)
    
    status = management.commands.serviceInstance.initialize(args)
    return HttpResponse("Status:: %s" % (status))

def svcActivate(request):
    form = "--form %s" % (request.GET.get('form'))
    
    config = request.GET.get('config')
    if config is None:
        return HttpResponse("Config file not provided")
    else:
        conf = "-c %s" % (config)
    
    oper = request.GET.get('operation')
    op  = "--operation %s" % (oper)
    
    proj = request.GET.get('project')
    if not proj:
        return HttpResponse("Tenant not specified")
    else:
        prj = "--proj %s" % (proj)
        
    mgmt = request.GET.get('mgmt')
    if not mgmt:
        return HttpResponse("Management-VN not specified")
    else:
        mgt = "--mgmt %s" % (mgmt)
        
    left = request.GET.get('left')
    if not left:
        return HttpResponse("Left-VN not specified")
    else:
        lft = "--left %s" % (left)
    
    right = request.GET.get('right')
    if not right:
        return HttpResponse("Right-VN not specified")
    else:
        rgt = "--right %s" % (right)
    
    svcTemp = request.GET.get('svctemp')
    if not svcTemp:
        return HttpResponse("Service Template is not specified")
    else:
        svcT = "--svctemp %s" % (svcTemp)
        
    svcName = request.GET.get('svcname')
    if not svcName:
        return HttpResponse("Service Name is not specified")
    else:
        svcN = "--svcname %s" % (svcName)
        
    svcmax = request.GET.get('svcmax')
    if not svcmax:
        return HttpResponse("Max service instance should be atleast 1")
    else:
        svcM = "--svcmax %s" % (svcmax)
        
    svcscale = request.GET.get('svcscale')
    if svcscale == 'true':
        svcS = "--auto_scale %s" % (svcscale)
    else:
        svcS = "--auto_scale"
    
    netpolicy = request.GET.get('netpolicy')
    if not netpolicy:
        return HttpResponse("Network policy is not specified")
    else:
        netP = "--policy %s" % (netpolicy)
    
    args = ("%s %s %s %s %s %s %s %s %s %s %s %s") % (form, conf, op, prj, mgt, lft, rgt, svcT, svcN, svcM, svcS, netP)
    status = management.commands.serviceInstance.initialize(args)
    
    return HttpResponse ("Status:: %s" % (status))