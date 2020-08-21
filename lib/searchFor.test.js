import { describe, Try } from 'riteway';
import searchFor from './searchFor';

describe('searchFor', async assert => {
  assert({
    given: 'no arguments',
    should: 'throw an error',
    actual: Try(searchFor).toString(),
    expected: 'Error: collection is required'
  });

  assert({
    given: 'a collection',
    should: 'throw an error',
    actual: Try(() => searchFor([])).toString(),
    expected: 'Error: key is required'
  });
});

describe('searchFor.fn', async assert => {
  assert({
    given: 'no arguments',
    should: 'return an empty array',
    actual: searchFor([], 'key')(),
    expected: []
  });

  {
    const collection = [{
      name: 'me'
    }, {
      name: 'you'
    }, {
      name: 'them'
    }];

    assert({
      given: 'search term',
      should: 'return correct results',
      actual: searchFor(collection, 'name')('me'),
      expected: [{ name: 'me' }]
    });
  }

  {
    const collection = [{
      name: 'me'
    }, {
      name: 'you'
    }, {
      name: 'them'
    }];

    assert({
      given: 'search term',
      should: 'return correct results',
      actual: searchFor(collection, 'name')('us'),
      expected: []
    });
  }

  {
    const collection = [{
      name: 'me'
    }, {
      name: 'you'
    }, {
      name: 'them'
    }];

    assert({
      given: 'search term',
      should: 'return correct results',
      actual: searchFor(collection, 'name')('m'),
      expected: [{ name: 'me' }, { name: 'them' }]
    });
  }

});
