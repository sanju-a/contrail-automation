from distutils.core import setup
from setuptools import find_packages

setup(
    name='attPoc',
    version='0.1.0',
    author='Sanju Abraham',
    author_email='sanjua@juniper.net',
    packages=find_packages(),
    url='http://pypi.python.org/pypi/attPoc/',
    license='LICENSE',
    description='NFV demo',
    long_description=open('README').read(),
    install_requires=[
        "Django == 1.5.1",
    ],
)
