import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Dimensions, ScrollView, FlatList } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Card } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Rating from '../components/rating';
import Colors from '../styles/colors';


var { height, width } = Dimensions.get("window");
let navParams;

export default class RestaurantDetails extends React.Component {
	constructor(props) {
		super(props);
		navParams = this.props.navigation.state.params.data;
		//console.warn('navParams******' + JSON.stringify(navParams.highlights.length));
		this.state = {
			addToFav: false,
		};
	}

	static navigationOptions = ({ navigation }) => {
		return {
			header: null

		};
	};

	ListEmptyView = () => {
		return (
			<View style={{ marginTop: 10, marginBottom: 10, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ textAlign: "center", fontSize: 16, width: width * 0.7, fontStyle: 'italic', fontWeight: '400' }}>
					Sorry ! No review avaliable for this restaurant.
        </Text>
			</View>
		);
	};

	renderItem(data) {

		let { item, index } = data;
		//console.warn(" renderItem listData*****" + JSON.stringify(item.restaurant.is_delivering_now));
		let uri = item.review.user.profile_image;
		let ratingColor = '#' + item.review.rating_color;
		return (
			<Card style={styles.reviewContainer}>
				<View style={styles.direction}>

					{/* Avatar */}
					<Avatar
						source={{ uri: uri }}
						size={60}
						rounded
						activeOpacity={0.7} />

					{/* User Info */}
					<View style={styles.userInfoContainer}>
						<Text style={styles.userTitle}>{item.review.user.name}</Text>
						<Text numberOfLines={2} style={styles.userSubTitle}>{item.review.review_text}</Text>

						{/* Like and Comment */}
						<View style={[styles.rowlayout, { justifyContent: 'space-around', marginTop: 5, alignSelf: 'flex-end', width: width * 0.55 }]}>
							<View style={styles.rowlayout} >
								<Icon name="favorite" size={22} color={Colors.delete} />
								<Text notes style={styles.optionStyle}>{item.review.likes}</Text>
							</View>

							<View style={{ borderLeftWidth: 1, borderColor: Colors.gray }}></View>

							<View style={styles.rowlayout} >
								<Icon name="comment" size={22} color={Colors.primaryColor} />
								<Text notes style={styles.optionStyle}>{item.review.comments_count}</Text>
							</View>

						</View>
					</View>

					{/* Rating */}
					<Rating rateColor={ratingColor} rate={item.review.rating} rateText={''} rateTextColor={null} />
				</View>
			</Card>
		);
	}


	render() {
		//let ratingColor =;
		return (
			<View style={styles.container}>
				<ImageBackground style={styles.imageContainer} source={{ uri: navParams.thumb }} >
					<View style={styles.imageBgContainer}>

						{/* Navigation */}
						<View style={[styles.direction, styles.navPosition]}>
							<TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
								<Icon name="arrow-back" size={32} color={Colors.white} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => { this.setState({ addToFav: !this.state.addToFav }) }}>
								<Icon name={this.state.addToFav === false ? "favorite-border" : "favorite"} size={32} color={this.state.addToFav === false ? Colors.white : Colors.delete} />
							</TouchableOpacity>
						</View>

						{/* Restaurant Title */}
						<View style={[styles.direction, styles.headerPosition]}>
							<View>
								<Text style={styles.headerText}>{navParams.name}</Text>
								<Text style={styles.subHeaderText}>{navParams.establishment[0]}</Text>
							</View>
							<Rating rateColor={'#' + navParams.user_rating.rating_color} rate={navParams.user_rating.aggregate_rating} rateText={navParams.user_rating.custom_rating_text} rateTextColor={Colors.white} />
						</View>
					</View>

				</ImageBackground>

				{/* Location */}
				<ScrollView style={{ flex: 1, backgroundColor: Colors.tooLightGray }}>
					<View style={[styles.direction, styles.restrtInfoContainer, { paddingTop: 7, }]}>
						<View style={{ width: width * 0.7, }}>
							<View style={[styles.direction,]}>
								<Icon name="place" size={20} color={Colors.secondaryDark} />
								<Text style={[styles.subHeaderText, { color: '', fontSize: 16 }]}>{navParams.location.locality_verbose}</Text>
							</View>
							<View style={[styles.direction, { marginTop: 5 }]}>
								<Icon name="smartphone" size={20} color={Colors.secondaryDark} />
								<Text style={[styles.subHeaderText, { color: '', fontSize: 16 }]}>{navParams.phone_numbers}</Text>
							</View>
						</View>

						{/* Call */}
						<View style={styles.callContainer}>
							<View style={styles.circle}>
								<Icon name="phone" size={25} color={Colors.white} style={{ alignSelf: 'center' }} />
							</View>
						</View>
					</View>

					{navParams.is_delivering_now !== 0 ? null : <Text style={styles.flDataRstMsg}>Currently order is not accepting</Text>}

					{/* <View style={styles.hrLine}></View> */}

					{/* Timings and avg cost */}
					<View style={[styles.direction, styles.restrtInfoContainer, { justifyContent: 'space-between', width: width * 0.95, paddingTop: 10, paddingBottom: 10, }]}>
						<View style={{ width: width * 0.45, alignContent: 'center' }}>
							<Text style={[styles.mediumText, { textAlign: 'center', }]}>Time</Text>
							<Text style={styles.highlightTxt}>{navParams.timings}</Text>
						</View>

						<View style={styles.vrtLine}></View>

						{/* avg cost */}
						<View style={{ width: width * 0.45, alignContent: 'center', justifyContent: 'center' }}>
							<Text style={[styles.mediumText, { textAlign: 'center', }]}>Averagr cost</Text>
							<Text style={styles.highlightTxt}>{"\u20B9 "}{navParams.average_cost_for_two} for 2 person</Text>
						</View>
					</View>

					{/* <View style={styles.hrLine}></View> */}

					{/* cuisines */}

					{navParams.cuisines !== '' ? <View style={[styles.rowlayout, { marginLeft: 10, marginTop: 10, marginRight: 10, }]}>
						<Text style={[styles.mediumText, { width: width * 0.3 }]}>Cuisines</Text>
						<Text style={styles.cuisineTxt}>{navParams.cuisines}</Text>
					</View> : null}

					{/* Table reservation */}
					{navParams.has_table_booking !== 0 ?
						<View style={[styles.rowlayout, { margin: 10, justifyContent: 'space-between' }]}>
							<Text numberOfLines={2} style={{ width: width * 0.5, flex: 1, fontSize: 15 }}>Book a table to enjoy your food without any trouble</Text>
							<Text style={styles.bookNowBtn}>Book Now</Text>
						</View> : null}

					{/* Additional info */}
					<Text style={styles.addedInfoTxt}>Added Facilities</Text>
					<View style={styles.addedInfoCtn}>
						<FlatList
							numColumns={navParams.highlights.length > 2 ? navParams.highlights.length / 2 : 1}
							horizontal={false}
							extraData={this.state}
							data={navParams.highlights}
							renderItem={({ item, index }) => {
								return (
									<Text style={styles.addedInfoValue}>{item}</Text>
								)
							}}
							scrollEnabled={false}
							keyExtractor={item => item}
							showsHorizontalScrollIndicator={false} />
					</View>

					{/* Review */}
					<Text style={[styles.addedInfoTxt, { backgroundColor: Colors.tooLightGray }]}>Review  ({navParams.all_reviews_count})</Text>
					<FlatList
						extraData={this.state}
						data={navParams.all_reviews.reviews}
						renderItem={this.renderItem.bind(this)}
						keyExtractor={item => item.review.id}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={() => this.ListEmptyView()}
					/>
				</ScrollView>
			</View >
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		/* marginLeft: 7,
		marginRight: 7, */
		backgroundColor: Colors.tooLightGray
	},
	imageContainer: {
		width: width,
		height: height * 0.35,
		position: 'relative',
	},
	imageBgContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	direction: {
		width: width,
		flexDirection: 'row',
	},
	headerPosition: {
		justifyContent: 'space-between',
		position: 'absolute',
		bottom: 0,
		left: 0,
		marginBottom: 10,
		paddingRight: 10,
	},
	navPosition: {
		justifyContent: 'space-between',
		position: 'absolute',
		top: 0,
		marginTop: 19,
		paddingLeft: 7,
		paddingRight: 15,
	},
	headerText: {
		fontSize: 20,
		marginLeft: 10,
		fontWeight: 'bold',
		width: width * 0.7,
		color: Colors.white,
		backgroundColor: Colors.transparent,

	},
	subHeaderText: {
		fontSize: 14,
		marginLeft: 10,
		width: width * 0.65,
		color: Colors.white,
		backgroundColor: Colors.transparent,
	},
	callContainer: {
		width: width * 0.3,
		alignItems: 'center',
		justifyContent: 'center'
	},
	circle: {
		width: 40,
		height: 40,
		borderRadius: 100 / 2,
		backgroundColor: Colors.green,
		justifyContent: 'center',
	},
	restrtInfoContainer: {
		//flex: 1,
		marginLeft: 7,
		marginRight: 7,
		marginBottom: 7,
	},
	mediumText: {

		fontSize: 18,
		color: Colors.gray
	},
	vrtLine: {
		borderWidth: 1,
		height: '90%',
		borderColor: Colors.primaryColor,
		justifyContent: 'center',
		alignSelf: 'center'
	},
	hrLine: {
		borderWidth: 0.8,
		width: '90%',
		borderColor: Colors.primaryColor,
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: 4,
	},
	highlightTxt: {
		fontSize: 16,
		fontWeight: '600',
		marginTop: 5,
		textAlign: 'center',
		color: Colors.black
	},
	cuisineTxt: {
		fontSize: 16,
		fontWeight: '400',
		color: Colors.black,
		width: width * 0.7
	},
	bookNowBtn: {
		backgroundColor: Colors.delete,
		textAlignVertical: 'center',
		color: Colors.white,
		borderRadius: 18,
		textAlign: 'center',
		padding: 5,
		width: width * 0.3
	},
	addedInfoTxt: {
		fontWeight: '600',
		paddingLeft: 10,
		backgroundColor: Colors.white,
		height: 40,
		textAlignVertical: 'center',
		marginTop: 10,
		fontSize: 18,
		color: Colors.secondaryDark,
	},
	addedInfoCtn: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 7,
		width: width * 0.9,
		paddingRight: 10
	},
	addedInfoValue: {
		fontSize: 16,
		fontWeight: '400',
		color: Colors.black,
		marginRight: 10,
		marginLeft: 10,
		marginRight: 10,
	},
	rowlayout: {
		flexDirection: 'row'
	},
	userInfoContainer: {
		/* marginTop: 7,
		marginBottom: 7, */
		marginLeft: 8,
		width: width * 0.55,
		//borderWidth: 1,
	},
	userTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.black
	},
	reviewContainer: {
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 10,
		padding: 10,
	},
	userSubTitle: {
		flex: 1,
		fontSize: 14,
		color: Colors.gray,
	},
	optionStyle: {
		fontSize: 17,
		marginLeft: 10,
		fontWeight: 'bold'
	},
	flDataRstMsg: {
		marginLeft: 10,
		marginBottom: 7,
		fontSize: 14,
		color: Colors.delete
	},

});