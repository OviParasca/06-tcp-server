'use strict';

const arrayBS = require('../../array_binary_search.js'); 

describe('Tests ArrayBinarySearch', () => {

  it('BinarySearch() inserts properly', () => {
    let testArray = arrayBS.binarySearch([4,8,15,16,23,42], 12);
    expect( testArray ).toEqual(-1);
  });

  it('BinarySearch() inserts properly', () => {
    let testArray = arrayBS.binarySearch([4,8,15,16,23,42], 4);
    expect( testArray ).toEqual(4);
  });

  it('BinarySearch() inserts properly', () => {
    let testArray = arrayBS.binarySearch([4,8,15,16,23,42], true);
    expect( testArray ).toEqual(-1);
  });

  it('BinarySearch() inserts properly', () => {
    let testArray = arrayBS.binarySearch([4,8,15,16,23,42], false);
    expect( testArray ).toEqual(-1);
  });

});
