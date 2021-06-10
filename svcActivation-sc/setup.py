from distutils.core import setup
from setuptools import find_packages

setup(
    name='poc',
    version='0.1.0',
    author='ABC',
    author_email='abc@abc.net',
    packages=find_packages(),
    url='http://pypi.python.org/pypi/svcActivation/',
    license='LICENSE',
    description='NFV demo',
    long_description=open('README').read(),
    install_requires=[
        "Django == 2.2.24",
    ],
)
