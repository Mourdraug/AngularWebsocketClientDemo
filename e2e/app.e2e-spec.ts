import { StompSpringDemoPage } from './app.po';

describe('stomp-spring-demo App', () => {
  let page: StompSpringDemoPage;

  beforeEach(() => {
    page = new StompSpringDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
