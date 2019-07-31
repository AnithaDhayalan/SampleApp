import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Dimensions, FlatList, TouchableNativeFeedback, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Card } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loader from '../components/loader';
import Rating from '../components/rating';
import Colors from '../styles/colors';

var { height, width } = Dimensions.get("window");

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			startFrom: 0,
			totalRestaurant: 0,
			loading: false,
			searchTerm: '',
			restaurantDt: [],
		};
	}

	static navigationOptions = ({ navigation }) => {
		const { params } = navigation.state

		return {
			title: 'Foodi',
			headerStyle: {
				backgroundColor: Colors.primaryColor,
			},
			headerTintColor: Colors.white,
			headerTitleStyle: { color: Colors.white },
			headerRight: (
				<TouchableOpacity onPress={() => params.handelNavigate()}>
					<Icon name="notifications-none" size={32} color={Colors.white} style={{ marginRight: 17 }} />
				</TouchableOpacity>
			),
		};
	};

	componentDidMount() {
		this.setState({ loading: true }, function () {
			this.getRestaurantList();
		});
	}

	getRestaurantList = () => {
		fetch(`https://developers.zomato.com/api/v2.1/search?start=${this.state.startFrom}&q=&count=10&apikey=6f40473d7eff532db3027d1c5d592acf`)
			.then(res => res.json())
			.then(res => {
				//console.warn('result ******' + JSON.stringify(res));
				this.setState({ loading: false, restaurantDt: this.state.startFrom === 0 ? res.restaurants : [...this.state.restaurantDt, ...res.restaurants], totalRestaurant: res.results_found });
			})
			.catch(error => {
				this.setState({ loading: false });
				console.error('Error ******' + error);
			});
	}

	loadMoreRestaurant = () => {
		this.setState({ startFrom: this.state.startFrom + 10 }, () => { this.getRestaurantList() });
	}


	renderFooter = () => {

		return (
			<View
				style={styles.footerLoader}	>
				<ActivityIndicator animating size="large" />
			</View>
		);
	};



	renderItem(data) {

		let { item, index } = data;
		//console.warn(" renderItem listData*****" + JSON.stringify(item.restaurant.is_delivering_now));
		let uri = item.restaurant.thumb;
		let ratingColor = '#' + item.restaurant.user_rating.rating_color;
		return (
			<TouchableNativeFeedback onPress={() => { this.props.navigation.navigate('RestaurantDetails', { data: item.restaurant }) }}>
				<Card style={styles.flatListItems}>
					<Card style={styles.flImageContainer}>
						<Image style={{ width: '100%', height: '100%', resizeMode: 'stretch', borderRadius: 8 }} source={{ uri: uri }} />
					</Card>

					{/* RestaurantDetails */}
					<View style={styles.flDataContainer}>
						<Text style={styles.flDataRstName}>{item.restaurant.name}</Text>
						{item.restaurant.cuisines !== '' ? <Text numberOfLines={1} style={styles.flDataRstSubTxt}>{item.restaurant.cuisines}</Text> : null}

						{/* Timings */}
						<View style={styles.flDataRstTiming}>
							<Image source={require('../assets/shop_open_time.png')} style={{ width: 22, height: 22, marginTop: 3 }} />
							<Text numberOfLines={1} style={[styles.flDataRstTimeTxt, { flex: 1, marginTop: 3 }]}>{item.restaurant.timings !== '' ? item.restaurant.timings : 'No timings'}</Text>
						</View>
						{item.restaurant.is_delivering_now !== 0 ? null : <Text style={styles.flDataRstMsg}>Currently order is not accepting</Text>}

						{/* Rating and avg cost */}
						<View style={[styles.flDataRstTiming, { paddingRight: 15, justifyContent: 'space-between' }]}>

							{/* Rating component */}
							<Rating rateColor={ratingColor} rate={item.restaurant.user_rating.aggregate_rating} rateText={item.restaurant.user_rating.custom_rating_text} rateTextColor={null} />

							<View style={styles.flDataRstTiming}>
								<Icon name="people" size={25} color={Colors.primaryColor} />
								<Text style={[styles.flDataRstTimeTxt, { alignSelf: 'center', marginLeft: 7 }]}>{"\u20B9 "}{item.restaurant.average_cost_for_two}</Text>
							</View>
						</View>


					</View>
				</Card>
			</TouchableNativeFeedback>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<Loader loading={this.state.loading} />
				{/* SearchBar */}
				<View style={[styles.headerContainer, styles.searchBar]}>
					<Icon name="search" size={32} color={Colors.gray} />
					<TextInput style={styles.searchText}
						placeholder="Search restaurant "
						onChangeText={(text) => this.setState({ searchTerm: text })}
						value={this.state.searchTerm} />
				</View>

				{/* Flatlist header */}
				{this.state.loading === false ? <View style={[styles.headerContainer, { justifyContent: 'space-between' }]}>
					<Text style={styles.headerText}>{this.state.totalRestaurant}  restaurants</Text>
					<Icon name="filter-list" size={32} color={Colors.primaryColor} style={{ marginRight: 17 }} />
				</View> : null}

				{this.state.loading === false ?
					<FlatList
						extraData={this.state}
						data={this.state.restaurantDt.filter((item) => item.restaurant.name.includes(this.state.searchTerm))}
						renderItem={this.renderItem.bind(this)}
						keyExtractor={item => item.restaurant.name}
						showsVerticalScrollIndicator={false}
						ListFooterComponent={this.renderFooter}
						onEndReached={this.loadMoreRestaurant}
						onEndReachedThreshold={0.3}
					/> : null}

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.tooLightGray
	},
	searchBar: {
		borderColor: Colors.gray,
		borderWidth: 1,
		borderRadius: 10,
		marginRight: 5,
		marginLeft: 5,
		marginTop: 8
	},
	searchText: {
		marginLeft: 5,
		flex: 1,
		marginRight: 5,
		fontSize: 18
	},
	headerContainer: {
		marginTop: 5,
		paddingLeft: 10,
		paddingRight: 10,
		flexDirection: 'row',
		alignItems: 'center',

	},
	headerText: {
		marginTop: 2,
		fontSize: 16,
		fontStyle: 'italic',
	},
	restaurantContainer: {

	},
	flatListItems: {
		flex: 1,
		flexDirection: 'row',
		marginLeft: 5,
		marginRight: 5,
		paddingLeft: 5,
		paddingRight: 5,
		paddingTop: 10,
		paddingBottom: 10,
		elevation: 1,

	}, flImageContainer: {
		elevation: 15,
		width: width * 0.35,
		borderRadius: 8,
	},
	flDataContainer: {
		width: width * 0.6,
		paddingLeft: 7,
		marginTop: 5
	},
	flDataRstName: {
		fontSize: 19,
		fontWeight: 'bold',
		color: Colors.black
	},
	flDataRstSubTxt: {
		flex: 1,
		fontSize: 13,
		color: Colors.gray
	},
	flDataRstMsg: {
		fontSize: 14,
		color: Colors.delete,
		marginBottom: 2,
	},
	flDataRstTiming: {
		flexDirection: 'row',
		marginTop: 3,
	},
	flDataRstTimeTxt: {
		//borderWidth: 1,
		fontSize: 15,
		marginLeft: 5,
		justifyContent: 'center',
	},
	footerLoader: {
		paddingVertical: 10,
	}
});