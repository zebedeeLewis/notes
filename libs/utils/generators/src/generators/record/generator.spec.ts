import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { recordGenerator } from './generator';
import { RecordGeneratorSchema } from './schema';

describe('record generator', () => {
  let tree: Tree;
  const options: RecordGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('a1: should run successfully', async () => {
    await recordGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    debugger
    expect(config).toBeDefined();
  });
});
