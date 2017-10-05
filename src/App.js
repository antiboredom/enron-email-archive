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
// import { Provider } from 'react-redux'
import './index.css';

const store = createStore((state = null, action) => {
  switch (action.type) {
    case 'SELECT':
      console.log(action);
      return action.id
    case 'RESET':
      return null
    default:
      return state;
  }
});

const host = 'http://archive.enron.email:8080/';
const searchkit = new SearchkitManager(host);

const EnronHitsListItem = props => {
  const {bemBlocks, result} = props;
  const source: any = extend({}, result._source, result.highlight);
  return (
    <div className={'item'} data-qa="hit">
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

class App extends Component {
  render() {
    // const selected = store.getState();
    const selected = store.getState();

    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            {/*<div className="my-logo">ENRON</div>*/}
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              prefixQueryFields={['subject^1', 'body^2']}
            />
          </TopBar>
          <LayoutBody>

            <SideBar>
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
            </SideBar>

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

                <ActionBarRow>
                  <GroupedSelectedFilters />
                  <ResetFilters />
                </ActionBarRow>

              </ActionBar>
              <Hits
                hitsPerPage={10}
                highlightFields={['subject', 'body']}
                sourceFilter={[
                  'body',
                  'subject',
                  'from_name',
                  'from_email',
                  'date',
                  'to',
                ]}
                itemComponent={EnronHitsListItem}
                scrollTo="body"
              />
              <NoHits suggestionsField={'subject'} />
              <Pagination showNumbers={true} />
            </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}
console.log(App.render);

store.subscribe(App.render);

export default App;
