
/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing a car
type SmartContract struct {
	contractapi.Contract
}

// Car describes basic details of what makes up a car
type Movie struct {
	Title   string `json:"title"`
	DurationInMin  int `json:"durationInMin"`
	Language string `json:"language"`
	ReleaseDate  string `json:"releaseDate"`
	Country string `json:"country"`
	Genre string `json:"genre"`

}

// QueryResult structure used for handling result of query
type QueryResult struct {
	Key    string `json:"Key"`
	Record *Movie
}

// InitLedger adds a base set of cars to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	movies := []Movie{
		Movie{Title: "DDLJ", DurationInMin: 137, Language: "Hindi", ReleaseDate: "15apr23", Country: "Japan", Genre: "Action"},
		Movie{Title: "Farz", DurationInMin: 128, Language: "English", ReleaseDate: "Brad", Country: "USA", Genre: "Comedy"},
		Movie{Title: "KKHH", DurationInMin: 170, Language: "Telgu", ReleaseDate: "Jin Soo", Country: "Korea", Genre: "Drama"},
		Movie{Title: "Dhoom", DurationInMin:110 , Language: "Kannada", ReleaseDate: "Max",	Country: "Germany", Genre: "Romance"},
		
	}

	for i, movie := range movies {
		movieAsBytes, _ := json.Marshal(movie)
		err := ctx.GetStub().PutState("Movie"+strconv.Itoa(i), movieAsBytes)

		if err != nil {
			return fmt.Errorf("Failed to put to world state. %s", err.Error())
		}
	}

	return nil
}

// CreateMovie adds a new Movie to the world state with given details
func (s *SmartContract) CreateMovie(ctx contractapi.TransactionContextInterface, movieNumber string,title string, durationInMin int, language string, releaseDate string, country string ,genre string) error {
//	func (s *SmartContract) CreateMovie(movieNumber string,title string, durationInMin int, language string, releaseDate string, country string ,genre string) error {
	movie := Movie{
		
		Title: title,
		DurationInMin: durationInMin,
		Language: language,
		ReleaseDate: releaseDate,
		Country: country,
	    Genre: genre,
	}

	movieAsBytes, _ := json.Marshal(movie)

	return ctx.GetStub().PutState(movieNumber, movieAsBytes)
}

// QueryMovie returns the Movie stored in the world state with given id
func (s *SmartContract) QueryMovie(ctx contractapi.TransactionContextInterface, movieNumber string) (*Movie, error) {
	movieAsBytes, err := ctx.GetStub().GetState(movieNumber)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if movieAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", movieNumber)
	}

	movie := new(Movie)
	_ = json.Unmarshal(movieAsBytes, movie)

	return movie, nil
}

// QueryMovieByName returns the movie stored in the world state with given Name
func (s *SmartContract) QueryMovieByName(ctx contractapi.TransactionContextInterface, title string) (*Movie, error) {
	movieAsBytes, err := ctx.GetStub().GetState(title)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if movieAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", title)
	}

	movie := new(Movie)
	_ = json.Unmarshal(movieAsBytes, movie)

	return movie, nil
}


// QueryAllCars returns all cars found in world state
func (s *SmartContract) QueryAllMovies(ctx contractapi.TransactionContextInterface) ([]QueryResult, error) {
	startKey := ""
	endKey := ""

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		movie := new(Movie)
		_ = json.Unmarshal(queryResponse.Value, movie)

		queryResult := QueryResult{Key: queryResponse.Key, Record: movie}
		results = append(results, queryResult)
	}

	return results, nil
}

// ChangeCarOwner updates the owner field of car with given id in world state
/*func (s *SmartContract) ChangeCarOwner(ctx contractapi.TransactionContextInterface, carNumber string, newOwner string) error {
	car, err := s.QueryCar(ctx, carNumber)

	if err != nil {
		return err
	}

	car.Owner = newOwner

	carAsBytes, _ := json.Marshal(car)

	return ctx.GetStub().PutState(carNumber, carAsBytes)
}*/

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create movie chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabcar chaincode: %s", err.Error())
	}
}