import axios from 'axios';

export const getGallery = async params => {
  return await axios
    .get('https://pixabay.com/api/', {
      params: {
        key: '39066012-1878526f9ed9fd04be913b678',
        ...params,
      },
    })
    .then(({ status, message, data }) => {
      if (status !== 200) {
        throw new Error(message);
      }
      return data;
    });
};