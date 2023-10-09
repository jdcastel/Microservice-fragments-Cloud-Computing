  const {
    listFragments,
    writeFragment,
    readFragment,
    writeFragmentData,
    readFragmentData,
    deleteFragment,
  } = require('../../src/model/data/memory/index.js');
  
  describe('tests functions in memory index -', () => {
    const f1 = { ownerId: 'f1', id: '1', fragment: 'f1 data text' };
    const f2 = { ownerId: 'f1', id: '2', fragment: 'f2 data text' };
  
    test('write fragment data into the In-Memory DB', async () => {
      await writeFragment(f1);
      await writeFragmentData('f1', '1', 'f1 data text');
  
      await writeFragment(f2);
      await writeFragmentData('f1', '2', 'f2 data text');
    });
  
    test('list of fragments test', async () => {
      const idList = await listFragments('f1');
      expect(Array.isArray(idList)).toBe(true);
      expect(idList).toEqual(['1', '2']);

      const listOfFragments = await listFragments('f1', true);
      expect(Array.isArray(listOfFragments)).toBe(true);
      expect(listOfFragments).toEqual([
        f1,f2,
      ]);
    });
  
    test('test read fragment', async () => {
      expect(await readFragment('f1', '1')).toEqual(f1);
    });
  
    test('test read fragmentData', async () => {
      expect(await readFragmentData('f1', '1')).toEqual('f1 data text');
    });
  
    test('test delete fragment', async () => {
      expect(await deleteFragment('f1', '1')).toBeDefined();
    });
  });