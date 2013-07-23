from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'attPoc.views.home', name='home'),
    # url(r'^attPoc/', include('attPoc.foo.urls')),
    url(r'^home$', TemplateView.as_view(template_name='attMIS/home.html'), name="home"),
    url(r'^rates/misonramp/', 'attMIS.views.miAaas'),
    url(r'^cancel/', 'attMIS.views.miAaasCancel'),
    url(r'^rates/', TemplateView.as_view(template_name='attMIS/rates.html'), name="rates"),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

