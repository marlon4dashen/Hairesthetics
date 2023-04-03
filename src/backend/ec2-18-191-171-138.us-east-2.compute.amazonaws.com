server {
    listen 443 ssl;
    listen [::]:443 ssl;
    include snippets/self-signed.conf;
    include snippets/ssl-params.conf;
    server_name ec2-18-191-171-138.us-east-2.compute.amazonaws.com www.ec2-18-191-171-138.us-east-2.compute.amazonaws.com;

    location / {
        include proxy_params;
        
#        if ($request_method ~* "(GET|POST)") {
#          add_header "Access-Control-Allow-Origin"  *;
#        }
        proxy_pass http://unix:/home/ubuntu/hairesthetics/backend/hairesthetics.sock;
    }
    location ~ ^/(socket\.io) {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/hairesthetics/backend/hairesthetics.sock;
        proxy_set_header   Host                 $host;
        proxy_set_header   X-Real-IP            $remote_addr;
        proxy_set_header   X-Forwarded-For      $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto    $scheme;
        
        proxy_redirect off;
        proxy_headers_hash_max_size 512;
        proxy_headers_hash_bucket_size 128;
    }
}

server {
    listen 80;
    listen [::]:80;

    server_name ec2-18-191-171-138.us-east-2.compute.amazonaws.com www.ec2-18-191-171-138.us-east-2.compute.amazonaws.com;

    return 302 https://$server_name$request_uri;
}