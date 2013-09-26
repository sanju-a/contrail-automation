from django.conf.urls import patterns, url
from django.views.generic import TemplateView

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'svcActivation.views.home', name='home'),
    # url(r'^svcActivation/', include('svcActivation.foo.urls')),
    url(r'^$', TemplateView.as_view(template_name='svcEngine/service.html'), name="service"),
    #url(r'^$', 'svcEngine.views.index'),
    url(r'^homeatt$', TemplateView.as_view(template_name='svcEngine/homeatt.html'), name="homeatt"),
    url(r'^ratesatt/misonramp$', 'svcEngine.views.miAaas'),
    url(r'^svcactivate$', 'svcEngine.views.svcActivate'),
    url(r'^cancel$', 'svcEngine.views.miAaasCancel'),
    url(r'^provdev$','svcEngine.views.provisionDevice'),
    url(r'^ratesatt$', TemplateView.as_view(template_name='svcEngine/ratesatt.html'), name="ratesatt"),
    url(r'^telstramis$', TemplateView.as_view(template_name='svcEngine/telstra.html'), name="telstra"),
    url(r'^contrailnfv$', TemplateView.as_view(template_name='svcEngine/contrail_demo_with_nfv.htm'), name="contrailnfv"),
    url(r'^contrailnonfv$', TemplateView.as_view(template_name='svcEngine/contrail_demo_without_nfv.htm'), name="contrailnonfv"),
    url(r'^orderdone$', TemplateView.as_view(template_name='svcEngine/demo_order_confirmation.htm'), name="contrailorderdone"),
    url(r'^ordercancel$', TemplateView.as_view(template_name='svcEngine/demo_service_cancellation.htm'), name="contrailcancelorder"),
    url(r'^canceldone$', TemplateView.as_view(template_name='svcEngine/demo_cancel_confirmation.htm'), name="contrailcancelok"),
    url(r'^ordersvcs$', TemplateView.as_view(template_name='svcEngine/contrail_demo_with_nfv.htm'), name="contrailordersvcs"),
    url(r'^editsvcs$', TemplateView.as_view(template_name='svcEngine/demo_edit_services.html'), name="contraileditsvcs"),
    url(r'^telstrainternet$', TemplateView.as_view(template_name='svcEngine/telstrainternet.html'), name="telstrainternet"),
    url(r'^telstravpn$', TemplateView.as_view(template_name='svcEngine/telstravpn.html'), name="telstravpn"),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

