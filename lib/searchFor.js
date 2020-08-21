export default function searchFor(collection, key) {
  if (!collection) throw new Error('collection is required');
  if (!key) throw new Error('key is required');
  
  return (searchTerm = '') => {
    return collection.filter(item =>
      item[key].toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
}
