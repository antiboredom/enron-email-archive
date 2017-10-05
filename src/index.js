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
  ResetFilters,
  InputFilter,
  InitialLoader,
  GroupedSelectedFilters,
  Layout,
  TopBar,
  LayoutBody,
  LayoutResults,
  ActionBar,
  ActionBarRow,
  SideBar,
  Toggle
} from 'searchkit';
import {createStore} from 'redux';
import './index.css';

const store = createStore((state = null, action) => {
  switch (action.type) {
    case 'SELECT':
      // window.location.hash = action.item._id;
      return action.item;
    case 'RESET':
      window.location.hash = '';
      return null;
    default:
      return state;
  }
});

const host = 'http://archive.enron.email:8080/';
const searchkit = new SearchkitManager(host);
// console.log(searchkit.accessors.getState());

const InitialLoaderComponent = props => (
  <div className="loader">
    loading please wait...
  </div>
);

const EnronHitsSmallListItem = props => {
  const {bemBlocks, result} = props;
  const source: any = extend({}, result._source, result.highlight);
  return (
    <div
      className={'item-line'}
      data-qa="hit"
      onClick={() => store.dispatch({type: 'SELECT', item: result})}>
      <p
        className="subject"
        dangerouslySetInnerHTML={{__html: result._source.subject}}
      />
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

const EnronHitsListItem = props => {
  const {bemBlocks, result, selected} = props;
  const source: any = extend({}, result._source, result.highlight);
  const isSelected = selected && selected._id === result._id;
  let classes = 'item';
  // if (isSelected) classes += ' selected';
  return (
    <div
      className={classes}
      data-qa="hit"
      onClick={() => store.dispatch({type: 'SELECT', item: result})}>
      {/*<p
        className="subject"
        dangerouslySetInnerHTML={{__html: result._source.subject}}
      /> */}
      <a name={result._id}></a>
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
    const selected = this.props.selected;
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

            {/*<SideBar>
              <InputFilter
                id="to_names"
                searchThrottleTime={500}
                title="To Address"
                placeholder=""
                searchOnChange={true}
                queryFields={['to']}
              />
              <InputFilter
                id="from_names"
                searchThrottleTime={500}
                title="From Address"
                placeholder=""
                searchOnChange={true}
                queryFields={['from_name', 'from_email']}
              />
            </SideBar>*/}

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

                {/*<ActionBarRow>
                  <GroupedSelectedFilters />
                  <ResetFilters />
                </ActionBarRow>*/}

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
                itemComponent={(props) => <EnronHitsListItem {...props} selected={selected} />}
                scrollTo={isSafari ? 'body' : 'html'}
              />
              <NoHits suggestionsField={'subject'} />
              <Pagination showNumbers={true} />
            </LayoutResults>

          </LayoutBody>
          <footer>
            <p>Made by By <a href="http://lav.io">Sam Lavigne</a> &amp; <a href="http://tegabrain.com/">Tega Brain</a>, from the <a href="https://www.cs.cmu.edu/~./enron/">Enron Email Dataset</a>.</p>
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

document.body.style.backgroundImage =
  "url('https://enron.email/static/back" + r + ".jpg')";

const render = () =>
  ReactDOM.render(
    <App selected={store.getState()} />,
    document.getElementById('root')
  );
store.subscribe(render);
render();
