import time
import sys
from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': 'archive.enron.email', 'port': 8080}])

def query(q, fields=["_all"], operator="and", size=10, start=0):
    body = {
        "query":{
            "simple_query_string" : {
                "query": q,
                "fields": fields,
                "default_operator": operator
            }
          },
          "size": size,
          "from": start,
          "sort":[
            {
              "_score":"desc"
            }
          ]
    }
    results = es.search(index="enron", body=body)

    return (results['hits']['hits'], results['hits']['total'])


def query_all(q, fields=["_all"], operator="and", maxresults=400):
    results = []
    start = 0
    size = 100

    _results, total = query(q, fields=fields, operator=operator, start=start)
    while len(results) < min(maxresults, total):
        time.sleep(.2)
        _results, _total = query(q, fields=fields, operator=operator, start=start, size=size)
        results += _results
        start += size

    return results


def get_lines(q):
    output = []
    results = query_all(sys.argv[1], fields=['body'])
    for result in results:
        text = result['_source']['body']
        text = text.split('\n')
        for line in text:
            line = line.strip()
            if q.lower().replace('"', '') in line.lower():
                output.append(line)

    output = list(set(output))
    output = sorted(output)
    for line in output:
        print(line)


if __name__ == '__main__':
    # call with python get_lines.py '"I love you"'
    q = sys.argv[1]
    get_lines(q)
