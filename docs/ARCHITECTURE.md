# Architecture

This project is structured in layers.

## Current structure

dal/
API requests and DTO types.

bll/
Business logic implemented through React hooks.

ui/
React components responsible for rendering UI.

## Data flow

API → DAL → BLL → UI

1. DAL performs API requests.
2. BLL processes data and manages state.
3. UI renders components.

## Notes

The current architecture comes from the IT-Incubator course.

It will be refactored later into a more scalable structure.