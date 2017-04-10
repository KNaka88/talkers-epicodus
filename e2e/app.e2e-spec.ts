import { TalkersPage } from './app.po';

describe('talkers App', () => {
  let page: TalkersPage;

  beforeEach(() => {
    page = new TalkersPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
