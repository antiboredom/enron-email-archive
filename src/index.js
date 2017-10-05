import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {extend} from 'lodash';
import {
  SearchkitManager,
  SearchkitProvider,
  SearchBox,
  Pagination,
  HitsStats,
  SortingSelector,
  NoHits,
  Hits,
  InitialLoader,
  Layout,
  TopBar,
  LayoutBody,
  LayoutResults,
  ActionBar,
  ActionBarRow,
  Toggle
} from 'searchkit';
import './index.css';

const host = 'http://archive.enron.email:8080/';
const searchkit = new SearchkitManager(host);

const InitialLoaderComponent = props => (
  <div className="loader">
    loading please wait...
  </div>
);

const EnronHitsListItem = props => {
  const result = props.result;
  const source: any = extend({}, result._source, result.highlight);
  let classes = 'item';

  return (
    <div className={classes} data-qa="hit">
      <p className="subject"><b>Subject:</b> {source.subject}</p>
      <p className="date"><b>Date:</b> {source.date}</p>
      <p className="from">
        <b>From:</b> {source.from_name} &#60;{source.from_email}&#62;
      </p>
      <p className="to"><b>To:</b> {source.to}</p>
      <div
        className="body"
        dangerouslySetInnerHTML={{__html: result._source.body}}
      />
    </div>
  );
};

class App extends Component {
  render() {
    const isSafari =
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      !navigator.userAgent.match('CriOS');

    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <div className="top">
            The Good Life
            <a className="signup" href="https://enron.email">Sign up</a>
          </div>
          <TopBar>
            <div className="logo">Search Enron</div>
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              prefixQueryFields={['subject^1', 'body^2']}
            />
          </TopBar>
          <LayoutBody>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats
                    translations={{
                      'hitstats.results_found': '{hitCount} results found'
                    }}
                  />
                  <SortingSelector
                    options={[
                      {label: 'Relevance', field: '_score', order: 'desc'},
                      {label: 'Date ascending', field: 'date', order: 'asc'},
                      {label: 'Date descending', field: 'date', order: 'desc'}
                    ]}
                    listComponent={Toggle}
                  />
                </ActionBarRow>
              </ActionBar>
              <InitialLoader component={InitialLoaderComponent} />
              <Hits
                hitsPerPage={10}
                highlightFields={['subject', 'body']}
                sourceFilter={[
                  'body',
                  'subject',
                  'from_name',
                  'from_email',
                  'date',
                  'to'
                ]}
                itemComponent={props => (
                  <EnronHitsListItem {...props} />
                )}
                scrollTo={isSafari ? 'body' : 'html'}
              />
              <NoHits suggestionsField={'subject'} />
              <Pagination showNumbers={true} />
            </LayoutResults>

          </LayoutBody>
          <footer>
            <p>
              Made by By
              {' '}
              <a href="http://lav.io">Sam Lavigne</a>
              {' '}
              &amp;
              {' '}
              <a href="http://tegabrain.com/">Tega Brain</a>
              , from the
              {' '}
              <a href="https://www.cs.cmu.edu/~./enron/">Enron Email Dataset</a>
              .
            </p>
          </footer>
        </Layout>
      </SearchkitProvider>
    );
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var r = getRandomInt(1, 4);

document.body.style.backgroundImage = "url('https://enron.email/static/back" + r + ".jpg')";

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
