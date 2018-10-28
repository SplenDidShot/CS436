# Use an official Python runtime as a parent image
FROM ubuntu
# Set the working directory to /app
WORKDIR /home/ubuntu/lab4_cloudnet
# Copy nginx config
COPY cloudnet_nginx.conf /etc/nginx/sites-available/ 

# Copy the current directory contents into the container at /app
#COPY . /home/ubuntu/lab4_cloudnet 
#RUN ls -la /home/ubuntu/lab4_cloudnet/*

# Install any needed packages specified in requirements.txt
RUN apt-get update && apt-get install -y \
    memcached \
    python-memcache \ 
    python3 \
    nginx \
    libmysqlclient-dev \
    libmemcached-dev \
    npm \
    python3-dev \
    python3-pip

RUN pip3 install python-memcached \ 
    pylibmc \
    django \
    pymysql \
    uwsgi \
    django-webpack-loader \
    djangorestframework \
    mysqlclient \
    django-filter \
    django-livereload \ 
    uWSGI \ 
    django-elasticache \ 
    pymemcache 

COPY package.json /home/ubuntu/lab4_cloudnet
RUN npm install material-ui-icons@1.0.0-beta.17 \
    material-ui@1.0.0-beta.34
RUN npm install --loglevel verbose

COPY . /home/ubuntu/lab4_cloudnet
RUN ln -s /etc/nginx/sites-available/cloudnet_nginx.conf /etc/nginx/sites-enabled/
#COPY memcached.conf /etc/memcached.conf

EXPOSE 8001
# Define environment variable
ENV NAME lab4_frinet
# Run app.py when the container launches
CMD /etc/init.d/memcached start && /etc/init.d/nginx start && npm run build && npm start
