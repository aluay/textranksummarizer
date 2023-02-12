import React from "react";
import "./Summarizer.css";

export default class OriginalText extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rawText: "", //  Original raw text input
			summarizedText: "", //  Summarized text output
		};
		//	Bind functions to the constructor
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.summarizeText = this.summarizeText.bind(this);
		this.intersect = this.intersect.bind(this);
		this.clearForm = this.clearForm.bind(this);
		this.handleLength = this.handleSubmit.bind(this);
	}

	//	Handle changes before the Summarize button is clicked
	handleChange(event) {
		this.setState({ rawText: event.target.rawText.value });
		this.setState({ summaryLength: event.target.summaryLength });
	}

	//	Handle submission after the Summarize button is clicked
	handleSubmit(event) {
		const summary = this.summarizeText(
			event.target.rawText.value,
			event.target.summaryLength.value
		);
		this.setState({ rawText: event.target.rawText.value });
		this.setState({ summarizedText: summary });
		event.preventDefault();
	}

	//  This implementation uses the TextRank algorithm, which calculates sentence similarity scores
	//  based on the overlap of words between sentences, and then ranks the sentences based on those
	//  scores to extract the most important sentences. The returned summary will be the sentences
	//  with the highest scores.

	summarizeText(rawText, summaryLength) {
		//	Check the selected length and assign it a number of sentences
		let sumLength = 0;
		if (summaryLength === "short") {
			sumLength = 3;
		} else if (summaryLength === "medium") {
			sumLength = 5;
		} else if (summaryLength === "long") {
			sumLength = 7;
		}

		// split text into sentences
		const sentences = rawText.split(/[.?!]+/);

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

		// return the sentences with the highest scores
		return (
			sortedSentences
				.slice(0, sumLength)
				.map((s) => s.sentence)
				.join(". ") + "."
		);
	}

	// helper function to calculate the intersection of two arrays
	intersect(a, b) {
		return a.filter((value) => b.includes(value));
	}

	//  Clear the form on Clear button click
	clearForm(event) {
		this.setState({ summarizedText: "", rawText: "" });
	}

	render() {
		return (
			<div className="content">
				<div className="input">
					<form onSubmit={this.handleSubmit}>
						<textarea
							rows={10}
							required
							name="rawText"
							placeholder="Original text"
						/>
						<div className="controls">
							<div className="length-menu">
								<p>Summary length:</p>
								<select
									name="summaryLength"
									onChange={this.handleChange}
									defaultValue={this.state.summaryLength}>
									<option value="short">Short</option>
									<option value="medium">Medium</option>
									<option value="long">Long</option>
								</select>
							</div>
							<button type="submit" className="summarize-btn">
								Summarize
							</button>
						</div>
					</form>
				</div>
				<div className="output">
					<textarea
						rows={10}
						onChange={(event) => this.state.summarizedText}
						value={this.state.summarizedText}
						placeholder="Summarized text"
					/>
					<button onClick={this.clearForm} className="clear-btn">
						Clear
					</button>
				</div>
			</div>
		);
	}
}
