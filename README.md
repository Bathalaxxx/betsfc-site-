# BetsFC Football Predictions Website

This is a static website for displaying daily football predictions, automatically updated via GitHub Actions.

## Setup

1. Clone this repository
2. Connect to Netlify for hosting
3. Set up the GitHub Actions secret:
   - Add `PREDICTION_DATA` as a repository secret with your daily predictions in the specified format

## Daily Update Process

The website will automatically update daily at 8:00 AM UTC via GitHub Actions. You can also manually trigger updates.

## Prediction Data Format

Provide predictions in this format:
