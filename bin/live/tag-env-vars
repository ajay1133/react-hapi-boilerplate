#!/bin/bash
# REF:  https://github.com/berpj/ec2-tags-env/blob/master/import-tags.sh

export AWS_DEFAULT_REGION=us-east-1

# read instance tags
get_instance_tags () {
    instance_id=$(/usr/bin/curl --silent http://169.254.169.254/latest/meta-data/instance-id)
    echo $(/usr/bin/aws ec2 describe-tags --filters "Name=resource-id,Values=$instance_id")
}

tags_to_env () {
    tags=$1

    for key in $(echo $tags | /usr/bin/jq -r ".[][].Key"); do
        key_upper=$(echo $key | /usr/bin/tr '-' '_' | /usr/bin/tr '[:lower:]' '[:upper:]')

        if [[ $key_upper == ENV:* ]]
        then
            value=$(echo $tags | /usr/bin/jq -r ".[][] | select(.Key==\"$key\") | .Value")
            key=${key_upper/ENV:/""}
            export $key="$value"
        fi

    done
}

instance_tags=$(get_instance_tags)
echo $instance_tags

tags_to_env "$instance_tags"
