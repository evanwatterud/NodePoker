var assert = require('assert');
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var test = require('selenium-webdriver/testing');

test.describe('Game', function() {
  this.timeout(5000);
  var driver;
  var server;

  test.before(function() {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    server = require('../app');
  });

  test.it('should rank players by hand value', async function(){
    await driver.get('localhost:8080');
    await driver.findElement(webdriver.By.css('#ai-players-dropdown > option:nth-child(4)')).click();
    await driver.findElement(webdriver.By.id('start-button')).click();
    await driver.findElement(webdriver.By.id('done-button')).click();
    var rank1Value = await driver.findElement(webdriver.By.id('rank1')).getText();
    var rank2Value = await driver.findElement(webdriver.By.id('rank2')).getText();
    var rank3Value = await driver.findElement(webdriver.By.id('rank3')).getText();
    var rank4Value = await driver.findElement(webdriver.By.id('rank4')).getText();
    rank1Value = parseInt(rank1Value.split('-')[1]);
    rank2Value = parseInt(rank2Value.split('-')[1]);
    rank3Value = parseInt(rank3Value.split('-')[1]);
    rank4Value = parseInt(rank4Value.split('-')[1]);
    assert.equal(rank1Value >= rank2Value && rank2Value >= rank3Value && rank3Value >= rank4Value, true);
  });

  test.after(function() {
    server.close();
    driver.quit();
    setTimeout(function () {
      process.exit(1);
    }, 1000);
  });
});
