import HotDiggeDy from 'HotDiggeDy';
import Immutable from 'immutable';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import axios from 'axios';

const app = HotDiggeDy({
  posts: [],
  isLoading: false,
  error: null
}, {
  fetchClicked(observable) {
    const getPosts$ = observable
      .flatMap(() => Observable.fromPromise(axios.get('http://jsonplaceholder.typicode.com/posts')))
      .map(result => result.data)
      .share();

    const resetPosts$ = observable.map(() => state => state.set('posts', Immutable.fromJS([])));
    const startFetching$ = observable.map(() => state => state.set('isLoading', true));
    const stopFetching$ = getPosts$.map(() => state => state.set('isLoading', false));
    const setNewPosts$ = getPosts$
      .map(posts => state => state.set('posts', Immutable.fromJS(posts)))
      .catch(err => state => state.set('error', err.message));

    return Observable.merge(
      resetPosts$,
      setNewPosts$,
      startFetching$,
      stopFetching$
    );
  }
});

const Demo = HotDiggeDy.Component((props, state, observables) => {
  return (
    <div>
      <h1>Number of posts {state('posts').size}</h1>
      <button on-click={observables.fetchClicked} disabled={state('isLoading')}>Fetch</button>
      {
        state('isLoading') ?
          <div>Loading stuff</div>
        :
          ''
      }
      {
        state('posts').size ?
          <ul>
            {state('posts').toJS().map(post => <li>{post.title}</li>)}
          </ul>
        :
          ''
      }
    </div>
  );
});

app.render(() => (
  <Demo/>
), document.querySelector('#root'));
