from django.http import HttpResponse
import management.commands.serviceInstance

def miAaas(request):
    config = request.GET.get('conf')
    
    if config is None:
        return HttpResponse("Config file not provided")
    else:
        conf = "-c %s" % (config)
        
    print "args %s" % (conf)
    status = management.commands.serviceInstance.initialize(conf)
    return HttpResponse("Status:: %s" % (status))

