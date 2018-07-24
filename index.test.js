require('chromedriver');
const {Builder, By, Capabilities, Key, until} = require('selenium-webdriver');

jest.setTimeout(10000);

let driver;
beforeAll(async () => {
  driver = await new Builder()
    .forBrowser('chrome')
    .withCapabilities(Capabilities.chrome())
    .build();
});

describe('Search', () => {
  it('searches when enter pressed', async () => {
    expect.assertions(1);
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('foobar', Key.RETURN);
    await driver.wait(until.titleContains('foobar'), 1000);
    return expect(driver.getTitle()).resolves.toMatch('foobar');
  });

  it('searches when button clicked', async () => {
    expect.assertions(1);
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('foobar');
    await driver.findElement(By.id('hplogo')).click(); // hide suggestions
    await driver.findElement(By.name('btnK')).click();
    await driver.wait(until.titleContains('foobar'), 1000);
    return expect(driver.getTitle()).resolves.toMatch('foobar');
  });

  it('skips results page when I\'m Feeling Lucky is clicked', async () => {
    expect.assertions(1);
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('foobar');
    await driver.findElement(By.id('hplogo')).click(); // hide suggestions
    const button = await driver.findElement(By.name('btnI'));
    await button.click();
    await driver.wait(until.titleContains('foobar'), 1000);
    const url = await driver.getCurrentUrl();
    return expect(url).not.toMatch('google.com');
  });

  it('has \'Google\' in the title', async () => {
     expect.assertions(1);
     await driver.get('http://www.google.com/ncr');
     await driver.wait(until.titleContains('Google'), 1000);
     return expect(driver.getTitle()).resolves.toMatch('Google');
  });
});

afterAll(async () => {
  await driver.quit();
});
