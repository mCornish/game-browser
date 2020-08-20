export default function searchFor(collection) {
  return (searchTerm, key) => {
    return collection.filter(item =>
      item[key].toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
}
