import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import { apiIbge } from '../../services/api';

interface UF {
  nome: string,
  sigla: string,
}

interface City {
  id: number,
  nome: string,
}

const Home = () => {
  const title = 'Seu marketplace de coleta de resíduos'
  const desc = 'Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.'

  const navigation = useNavigation();

  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [uf, setUf] = useState<string>('')
  const [city, setCity] = useState<string>('')

  useEffect(() => {
    apiIbge.get<UF[]>('/estados').then(response => {
      setUfs(response.data.sort((a, b) => alphabetic(a.nome, b.nome)));
    })
  }, [])

  useEffect(() => {
    if(uf !== '') {
      apiIbge.get<City[]>(`/estados/${uf}/municipios`).then(response => {
        setCities(response.data.sort((a, b) => alphabetic(a.nome, b.nome)));
      })
    }
  }, [uf])

  const alphabetic = (a: string, b: string) => (
    a < b ? -1 : a > b ? 1 : 0 
  )

  const handleNavigate = () => {
    navigation.navigate("Points", { city, uf });
  }

  return (
    <ImageBackground 
      style={styles.container}
      source={require('../../assets/home-background.png')}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{desc}</Text>
      </View>
      <View style={styles.footer}>
        <RNPickerSelect
          style={pickerStyle}
          placeholder={{ label: 'Selecione o Estado', value: '' }}
          disabled={ufs.length === 0}
          onValueChange={(value) => setUf(value)}
          items={ufs.map(uf => (
            { value: uf.sigla, label: `${uf.nome} - ${uf.sigla}`}
          ))}
        />
        <RNPickerSelect
          style={pickerStyle}
          placeholder={{ label: 'Selecione a Cidade', value: '' }}
          disabled={cities.length === 0 || uf === ''}
          onValueChange={(value) => setCity(value)}
          items={cities.map(city => (
            { value: city.nome, label: city.nome }
          ))}
        />
        <RectButton style={styles.button} onPress={handleNavigate}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#FFF" size={24} />
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerStyle = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#6C6C80',
  },

  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#6C6C80',
  },
})

export default Home;