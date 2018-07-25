/* Renders group related section of web panel*/

import React, { Component } from 'react';

import { CardGroup } from 'mdb';
import MainGroupCard from './mainGroupCard';
import GroupCard from './groupCard';
import PropTypes from 'prop-types';
import NewGroupButton from './newGroupButton';
/*
For when a user has been validated,
and the server exists. Contains the actual options etc.
*/
export default class serverPanel extends Component {
	constructor(props) {
		super(props);
		this.editGroup = props.editGroup;
		this.subGroupDecks = [];
		const array = this.props.settings.subgroups;
		// Splits array into arrays of 3 or less
		var i,j,smallArray,chunk = 3;
		for (i=0,j=array.length; i<j; i+=chunk) {
			smallArray = array.slice(i,i+chunk);
			let deck = [];
			for (var current of smallArray) {
				deck.push(<GroupCard group={current} editGroup={this.editGroup} key={current.id}/>);
			}
			this.subGroupDecks.push(
				<CardGroup deck={true} className= "mb-2" key={i}>
					{deck}
				</CardGroup>
			);
		}



	}
	render () {
		return (
			<div id="groups">
				<MainGroupCard group={this.props.settings.mainGroup} editGroup={this.editGroup}/>
				<h1>Other groups <NewGroupButton/></h1>
				{this.subGroupDecks}
			</div>

		);
	}
}
serverPanel.propTypes = {
	settings: PropTypes.object.isRequired,
	editGroup: PropTypes.func.isRequired
};