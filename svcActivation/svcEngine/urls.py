from django.conf.urls import patterns, include, url
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
    url(r'^ratesatt$', TemplateView.as_view(template_name='svcEngine/ratesatt.html'), name="ratesatt"),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

