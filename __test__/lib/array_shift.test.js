'use strict';

const arrayShift = require('../../array_shift.js'); 

describe('Tests for the Array Shift', () => {

  it('insertShift() inserts properly', () => {
    let testArray = arrayShift([1, 3, 2, 4], 7);
    expect( testArray ).toEqual([1, 3, 7, 2, 4]);
  });

});
