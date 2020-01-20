import { MockRenderer } from './fake-renderer.mock';

export class MockRendererFactory {
  createRenderer() {
    return new MockRenderer();
  }
}
