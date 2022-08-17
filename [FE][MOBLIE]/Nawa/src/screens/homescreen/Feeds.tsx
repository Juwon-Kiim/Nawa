import React, { useRef, useEffect, useState, useCallback } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View, Image, Button, ActivityIndicator, RefreshControl, Alert } from "react-native";

import axios from 'axios';
import { FAB } from "@rneui/base";
import MainNavbar from "./MainNavbar";
import { useIsFocused, useFocusEffect } from '@react-navigation/native'
import EncryptedStorage from 'react-native-encrypted-storage';

import Video from "react-native-video";
import userSlice from "../../slices/user";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer";
import UserIcon from "../../components/userIcon";
import { useAppDispatch } from "../../store";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.05;

function Feeds ({ navigation }) {

  const [feeds, setFeeds] = useState<object[]>([]);
  const [page, setPage] = useState<number>(0);
  // const [totalFeeds, setTotalFeeds] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [noMoreFeed, setNoMoreFeed] = useState<boolean>(false);
  const [ticTok, setTicTok] = useState<boolean>(false);
  const [refreshing, setReFreshing] = useState<boolean>(false);

  const isFocused = useIsFocused()
  
  const animationRef = useRef(new Animated.Value(0)).current;
  
  const url = 'http://i7d205.p.ssafy.io/api/'
  const myId = useSelector((state: RootState) => state.user.accessToken)
  
  const translateY = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -HEADER_HEIGHT],
  });

  const getfeeds = () => {
    const sendUrl = `${url}board/mainFeed/NEW/${page}`
    setLoading(true)
    axios.get(
      sendUrl,
      { headers: { Authorization : `Bearer ${myId}` }}
    ).then(res => {
      setFeeds([...feeds, ...res.data])
      setPage(page + res.data.length)
    }).catch(err => Alert.alert('알림', `오류 발생 ${err}`))
    setLoading(false)
  }
    
  useEffect(() => {
    // console.log('access token', myId)
    // const sendUrl = `${url}board/`

    // 현재 피드의 총 갯수 확인
    // axios.get(
    //   'http://i7d205.p.ssafy.io/api/board/count',
    //   { headers: { Authorization : `Bearer ${myId}` }}
    // ).then(res=> setTotalFeeds(res.data))

    // refresh 해제
    setReFreshing(false)

    // 초기 10개의 피드 호출
    getfeeds();

  },[isFocused, ticTok])
  
  const checkfeed = async () => {
    if (!loading) {
      if (page >= 10 && !noMoreFeed) {
        getfeeds();
      }
    }
  }

  const refresh = () => {
    setReFreshing(true)
    console.log('refresh')
    setPage(0)
    getfeeds()
  }

  const dispatch = useAppDispatch();
  const logOutHAzaJaHuckAAAAAAAAAA = async () => {
    dispatch(
      userSlice.actions.setUser({ // redux state는 값이 변하면, useselector로 참조하고 있는 모든 컴포넌트가 다시 렌더링.
        userId : '',
        accessToken : '',
        nickname : ''
      }),
    );
  
    EncryptedStorage.removeItem('userId')
    EncryptedStorage.removeItem('accessToken')
    EncryptedStorage.removeItem('refreshToken')
  }


  const MainFeed = () => {
    let fileUrl:string;
    let fileType:string;

    const onPressListHandler = (data: object) => {
      navigation.navigate('Main', {screen: 'FeedDetail', params: data})
    };

    const onefeed = ({item}) => one(item)

    const one = (item: object) => {
      // console.log(item, item.files?.length)
      if ( item.files.length > 0 ) {
        const data = item.files[0]
        // console.log(data.fileType, data.fileName)
        fileUrl = `${url}file/${(data.fileType === 'IMAGE') ? 'IMAGE' : 'video'}/${data.fileName}`
        fileType = data.fileType
        console.log(fileUrl)
      }

      return (
        <TouchableWithoutFeedback
        style={styles.feed}
        onPress={() => {
          onPressListHandler(item)
        }}
        >
          <View style={ styles.feedItem }>
            { item.files.length > 0 ?
            <View
              style={{
                alignItems: 'center',
              }}
            >
              { (fileType === 'IMAGE') ?
                <Image
                  source={{ uri: fileUrl }}
                  style={{
                    width: SCREEN_WIDTH * 0.8,
                    height: SCREEN_HEIGHT * 0.3,
                    resizeMode: 'cover',
                  }}
                />
                :
                <Video
                  source={{ uri: fileUrl }}
                  repeat={true}
                  resizeMode="cover"
                  controls={true}
                  muted={true}
                  style={{
                    height: SCREEN_WIDTH * 0.8,
                    width: SCREEN_WIDTH * 0.8,
                  }}
                />
              }
            </View>
            :
            <View style={ styles.content }><Text style={{ textAlign:'center'}}>{ item.boardContent }</Text></View>}

            <View style={ styles.underBar }>
              <View style={styles.userIcon}><UserIcon /></View>
              <View style={styles.textBox}><Text style={styles.text}>{item.boardTitle}</Text></View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        )
      }

    return (
      <>
        {refreshing ? <ActivityIndicator style={{ zIndex: 100 }}/> : null}
        <Animated.FlatList
        data={feeds}
        renderItem={onefeed}
        style={{
          backgroundColor: "white",
          transform: [{ translateY: translateY }],
          elevation: 8,
        }}
        nestedScrollEnabled
        
        onEndReachedThreshold = {0.1}
        onEndReached={ checkfeed }
        
        refreshing
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        
        ListEmptyComponent={
          <View><Text>새로운 이야기를 채워주세요</Text></View>
        }
        
        // 보통 여기에 로딩(원 도는거 넣는다는데...)
        // ListFooterComponent={}
        ></Animated.FlatList>
      </>
    )
  }

  return (
    <>
      <MainNavbar />
      <MainFeed />
      <FAB

        onPress={() => {navigation.navigate('NewFeedScreen')}}
        placement="right"
        icon={{ name: 'add', color: 'white'}}
        color="red"
        />
      <Button title="로그아웃" onPress={() =>logOutHAzaJaHuckAAAAAAAAAA() }></Button>
    </>
  )
}

const styles = StyleSheet.create({
  feed: {
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  feedItem : {
    flexDirection: 'column',
    backgroundColor : 'lightgrey',
    paddingVertical : SCREEN_HEIGHT * 0.005,
    marginHorizontal : 10,
    marginTop : 10,
    height : 'auto',
  },
  content : {
    flex : 11,
    backgroundColor : 'white',
    marginHorizontal : 5,
    marginTop : 5,
    borderRadius : 10,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingVertical: SCREEN_HEIGHT * 0.005,
  },
  underBar : {
    flex : 2,
    flexDirection : 'row',
  },
  userIcon : {
    marginHorizontal : 5,
    marginVertical : 5,
  },
  textBox : {
    flex : 1,
    backgroundColor : 'white',
    marginRight : 5,
    marginVertical : 5,
    borderRadius : 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text : {
    textAlign: 'center',
    fontSize: 15
  },
})

export default Feeds