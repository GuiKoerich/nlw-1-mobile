import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.0.108:3333/',
});

export const apiIbge = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',
})