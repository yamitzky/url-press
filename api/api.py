import datetime
import os

from bottle import route, run, request, abort, response, redirect, hook
import boto3


DEBUG = os.environ.get('DEBUG') == '1'
if DEBUG:
    CORS_ALLOW_ORIGIN = os.environ.get('CORS_ALLOW_ORIGIN') or '*'
else:
    CORS_ALLOW_ORIGIN = os.environ['CORS_ALLOW_ORIGIN']

if os.environ.get('DYNAMO_ENDPOINT_URL'):
    dynamo = boto3.resource('dynamodb', endpoint_url=os.environ['DYNAMO_ENDPOINT_URL'])
else:
    dynamo = boto3.resource('dynamodb')
table = dynamo.Table(os.environ.get('DYNAMO_TABLE_NAME', 'url-press'))


@hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = CORS_ALLOW_ORIGIN
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type'


@route('/<:re:.+>', method='OPTIONS')
def options_handler():
    return


@route('/<slug:re:.+>')
def redirect_url(slug):
    api = slug.startswith('api/urls/')
    if api:
        slug = slug[9:]
    item = table.get_item(Key={'id': slug}).get('Item', {})
    if item:
        if api:
            return {
                'id': item['id'],
                'url': item['url'],
                'timestamp': int(item['timestamp'])
            }
        else:
            redirect(item['url'])
    else:
        abort(404, f"Not found: {slug}")


@route('/api/urls', method=['GET', 'POST'])
def generate():
    if request.method == 'POST':
        item = {
            'id': request.json['id'],
            'url': request.json['url'],
            'timestamp': int(datetime.datetime.now().timestamp())
        }
        table.put_item(Item=item)
        response.status = 201
        return item
    else:
        cursor = request.params.get('cursor')
        if cursor:
            result = table.scan(ExclusiveStartKey=cursor)
        else:
            result = table.scan()
        items = result['Items']
        for item in items:
            item['timestamp'] = int(item['timestamp'])
        return {
            'urls': items,
            'cursor': result.get('LastEvaluatedKey')
        }


run(host='0.0.0.0', port=8080, debug=DEBUG, reloader=DEBUG)
