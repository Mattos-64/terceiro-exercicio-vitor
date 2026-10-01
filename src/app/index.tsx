import * as ImagePicker from 'expo-image-picker'; // Biblioteca para acessar a galeria
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [bio, setBio] = useState('');                 
  const [modalVisivel, setModalVisivel] = useState(false); 
  const [textoTemp, setTextoTemp] = useState('');     
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(false); 
  const [alertaVisivel, setAlertaVisivel] = useState(false); 
  
  const [fotoPerfil, setFotoPerfil] = useState(require('../../assets/images/logo.jpeg'));

  const escolherFotoDaGaleria = async () => {
    const permissaoStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissaoStatus.status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a galeria de fotos!');
      return;
    }

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,  
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setFotoPerfil(resultado.assets[0].uri);
    }
  };

  useEffect(() => {
    let intervalo = null;

    if (notificacoesAtivas && !modalVisivel && !alertaVisivel) {
      intervalo = setInterval(() => {
        setAlertaVisivel(true); 

        const mensagens = [
          "Novo seguidor no perfil!",
          "Alguém visualizou seu cartão!",
          "Você recebeu uma nova mensagem!",
          "Lembrete: Atualize suas redes sociais."
        ];
        const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
        
        Alert.alert(
          "🔔 Notificação", 
          mensagemAleatoria,
          [
            {
              text: "OK",
              onPress: () => setAlertaVisivel(false) 
            }
          ],
          { cancelable: false }
        );
      }, 5000);
    } else {
      if (intervalo) clearInterval(intervalo);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [notificacoesAtivas, modalVisivel, alertaVisivel]);

  const salvarBio = () => {
    setBio(textoTemp);
    setModalVisivel(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <View style={styles.card}>
            
            <View style={styles.cabecalho}>
              <Pressable onPress={escolherFotoDaGaleria} style={styles.avatarContainer}>
                <Image
                  source={typeof fotoPerfil === 'string' ? { uri: fotoPerfil } : fotoPerfil}
                  style={styles.avatar}
                />
                <View style={styles.badgeEdicaoFoto}>
                  <Text style={styles.textoBadge}>📷</Text>
                </View>
              </Pressable>
              
              <Text style={styles.title}>Lucas Silva Mattos Vieira</Text>
              <Text style={styles.subtituloFoto}>Toque na foto para alterar</Text>
            </View>

            {/* Seção da Bio */}
            <View style={styles.secao}>
              <Text style={styles.rotuloSecao}>Bio</Text>
              <View style={styles.caixaBio}>
                <Text style={styles.textoBio}>
                  {bio === '' ? 'Nenhuma bio cadastrada ainda.' : bio}
                </Text>
              </View>
              
              <Pressable 
                style={styles.botaoEditar} 
                onPress={() => {
                  setTextoTemp(bio);
                  setModalVisivel(true);
                }}
              >
                <Text style={styles.textoBotaoEditar}>Editar bio</Text>
              </Pressable>
            </View>

            {/* Seção de Configurações */}
            <View style={styles.secao}>
              <Text style={styles.rotuloSecao}>Configurações</Text>
              <View style={styles.linhaSwitch}>
                <Text style={styles.textoSwitch}>Receber Notificações</Text>
                <Switch
                  value={notificacoesAtivas}
                  onValueChange={setNotificacoesAtivas}
                />
              </View>
            </View>

            {/* Botão Salvar */}
            <Pressable 
              style={styles.botaoSalvar} 
              onPress={() => Alert.alert("Sucesso", "Dados salvos com sucesso!")}
            >
              <Text style={styles.textoBotaoSalvar}>Salvar</Text>
            </Pressable>

          </View>

        </ScrollView>

        {/* Modal de Edição da Bio */}
        <Modal
          visible={modalVisivel}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalFundo}>
            <View style={styles.modalConteudo}>
              <Text style={styles.modalTitulo}>Editar sua Bio</Text>
              
              <TextInput
                style={styles.inputBio}
                placeholder="Escreva algo sobre você..."
                multiline={true}
                value={textoTemp}
                onChangeText={setTextoTemp}
              />

              <View style={styles.modalBotoes}>
                <Pressable 
                  style={[styles.botaoModal, styles.botaoCancelar]} 
                  onPress={() => setModalVisivel(false)}
                >
                  <Text style={styles.textoBotaoModal}>Cancelar</Text>
                </Pressable>

                <Pressable 
                  style={[styles.botaoModal, styles.botaoSalvarModal]} 
                  onPress={salvarBio}
                >
                  <Text style={styles.textoBotaoModal}>Salvar Bio</Text>
                </Pressable>
              </View>

            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  badgeEdicaoFoto: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  textoBadge: {
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtituloFoto: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  secao: {
    marginTop: 15,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  rotuloSecao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  caixaBio: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    backgroundColor: '#fafafa',
    marginBottom: 10,
    justifyContent: 'center',
  },
  textoBio: {
    color: '#444',
    fontSize: 14,
  },
  botaoEditar: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoEditar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  linhaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoSwitch: {
    fontSize: 14,
    color: '#333',
  },
  botaoSalvar: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoSalvar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalConteudo: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputBio: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 20,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  botaoModal: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  botaoCancelar: {
    backgroundColor: '#6b7280',
  },
  botaoSalvarModal: {
    backgroundColor: '#2563eb',
  },
  textoBotaoModal: {
    color: '#fff',
    fontWeight: 'bold',
  },
});