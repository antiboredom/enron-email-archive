## Enron Archive

A front-end to search through the enron email archives, with an Elasticsearch backend, based on the [Searchkit starter app](https://github.com/searchkit/searchkit-starter-app.git).

To search, just go to [archive.enron.email](http://archive.enron.email).

You can also query the app programmatically using the [elasticsearch dsl](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html). If you do so, please don't hit the system too hard...

The fields are:

```
date
from_name
from_email
to
subject
body
```

To query the archive in python, first install the elasticsearch module:

```
pip install elasticsearch
```

Then use like so:

```python
from elasticsearch import Elasticsearch
es = Elasticsearch([{'host': 'archive.enron.email', 'port': 8080}])

# get a single document by id
result = es.get(index="enron", doc_type="mail", id=5)

# perform a simple search
results = es.search(index="enron", body={"query": {"match": {"subject": "Hi"}}})

# query the subject and body fields and return 10 records, sorted by relevance:

query = {
    "query":{
        "simple_query_string" : {
            "query": "\"I love you\"",
            "fields": ["subject","body"],
            "default_operator": "and"
        }
      },
      "size":10,
      "from": 0,
      "sort":[
        {
          "_score":"desc"
        }
      ]
}

results = es.search(index="enron", body=query)
```

