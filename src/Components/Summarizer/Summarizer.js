import React from "react";
import "./Summarizer.css";

export default class OriginalText extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rawText: "",
			summarizedText: "",
		};
		//	Bind functions to the constructor
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.summarizeText = this.summarizeText.bind(this);
		this.intersect = this.intersect.bind(this);
	}

	handleChange(event) {
		this.setState({ rawText: event.target.value });
	}

	handleSubmit(event) {
		const summary = this.summarizeText(this.state.rawText);
		this.setState({ summarizedText: summary });
		event.preventDefault();
	}

	//  This implementation uses the TextRank algorithm, which calculates sentence similarity scores
	//  based on the overlap of words between sentences, and then ranks the sentences based on those
	//  scores to extract the most important sentences. The returned summary will be the first 3 sentences
	//  with the highest scores.

	summarizeText(text) {
		const sentences = text.split(/[.?!]+/); // split text into sentences

		// create a matrix to store sentence similarity scores
		const similarityMatrix = [];
		for (let i = 0; i < sentences.length; i++) {
			similarityMatrix[i] = [];
			for (let j = 0; j < sentences.length; j++) {
				similarityMatrix[i][j] = 0;
			}
		}

		// calculate sentence similarity scores
		for (let i = 0; i < sentences.length; i++) {
			for (let j = i + 1; j < sentences.length; j++) {
				const intersection = this.intersect(
					sentences[i].split(" "),
					sentences[j].split(" ")
				);
				similarityMatrix[i][j] =
					intersection.length /
					(Math.log(sentences[i].length) + Math.log(sentences[j].length));
				similarityMatrix[j][i] = similarityMatrix[i][j];
			}
		}

		// calculate sentence scores
		const sentenceScores = [];
		for (let i = 0; i < sentences.length; i++) {
			let score = 0;
			for (let j = 0; j < sentences.length; j++) {
				if (i !== j) {
					score += similarityMatrix[i][j];
				}
			}
			sentenceScores[i] = score;
		}

		// sort sentences by score
		const sortedSentences = [];
		for (let i = 0; i < sentences.length; i++) {
			sortedSentences.push({
				sentence: sentences[i],
				score: sentenceScores[i],
			});
		}
		sortedSentences.sort((a, b) => b.score - a.score);

		// return the first 3 sentences with the highest scores
		return (
			sortedSentences
				.slice(0, 3)
				.map((s) => s.sentence)
				.join(". ") + "."
		);
	}

	// helper function to calculate the intersection of two arrays
	intersect(a, b) {
		return a.filter((value) => b.includes(value));
	}

	render() {
		return (
			<div className="content">
				<div className="input">
					<h2>Enter text below to summarize</h2>
					<form onSubmit={this.handleSubmit}>
						<textarea
							placeholder="Enter text to summarize"
							value={this.state.rawText}
							onChange={this.handleChange}
							rows={10}
						/>
						<button type="submit">Summarize</button>
					</form>
				</div>
				<div className="output">
					<h2>Summarized text</h2>
					<textarea
						placeholder="Summary"
						value={this.state.summarizedText}
						onChange={(event) => this.state.summarizedText}
						rows={10}
					/>
				</div>
			</div>
		);
	}
}
