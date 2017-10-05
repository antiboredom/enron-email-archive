'''
archive.enron.email uses Elasticsearch, which you can query directly.

The fields are:
    date
    from_name
    from_email
    to
    subject
    body


Here's an example query that the web frontend uses to search all fields,
sorted by relevance

{
  "query":{
    "bool":{
      "should":[
        {
          "simple_query_string":{
            "query":"hi",
            "fields":[
              "_all"
            ]
          }
        },
        {
          "multi_match":{
            "query":"hi",
            "type":"phrase_prefix",
            "fields":[
              "subject^1",
              "body^2"
            ]
          }
        }
      ]
    }
  },
  "size":10,
  "from": 0
  "sort":[
    {
      "_score":"desc"
    }
  ]
}

You can see the full elasticsearch query api here:
https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
'''

from elasticsearch import Elasticsearch
es = Elasticsearch([{'host': 'archive.enron.email', 'port': 8080}])

# get a single document by id
result = es.get(index="enron", doc_type="mail", id=5)

# perform a simple search
results = es.search(index="enron", body={"query": {"match": {"subject": "Hi"}}})
