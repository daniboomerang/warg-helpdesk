'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('synoptic-demo', function() {

  browser.get('index.html');

  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('/');
    });


    it('should render view1 when user navigates to /view1', function() {
      element(by.model('email')).sendKeys("admin@example.com");
      element(by.model('password')).sendKeys("secret");
      element(by.buttonText('Sign In')).click();
      expect(browser.getLocationAbsUrl()).toMatch("/helpdesk/incidences/open/list");
    });

  });


});
