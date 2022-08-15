package api

import (
	"fmt"
	"io"
	"net/http"
	"shortener/core/database"
	"shortener/core/exception"
	"shortener/core/helper"
	"shortener/core/model/web"
	"shortener/core/repository"
	"shortener/core/service"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	defer errorHandler(w, r)

	db := database.NewDB()

	// registering repository
	urlRepository := repository.NewUrlRepository(db)

	// registering service
	urlService := service.NewUrlService(urlRepository)

	switch r.Method {
	case "GET":
		request := web.FindByAliasUrlRequest{
			Alias: r.URL.Query().Get("alias"),
		}

		response := urlService.FindByAlias(request)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)

		_, err := fmt.Fprintf(w, string(helper.ToJSON(web.DefaultResponse[any]{
			Code:    http.StatusOK,
			Message: "OK",
			Data:    response,
		})))

		if err != nil {
			panic(err)
		}
	case "POST":
		body, err := io.ReadAll(r.Body)
		if err != nil {
			panic(err)
		}

		json := helper.FromJSON(body)

		request := web.CreateUrlRequest{
			Alias:       json["alias"],
			Destination: json["destination"],
		}

		response := urlService.Create(request)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)

		_, err = fmt.Fprintf(w, string(helper.ToJSON(web.DefaultResponse[any]{
			Code:    http.StatusOK,
			Message: "OK",
			Data:    response,
		})))

		if err != nil {
			panic(err)
		}
	}
}

func errorHandler(w http.ResponseWriter, r *http.Request) {
	err := recover()

	if err != nil {
		if notFoundHandler(w, r, err) {
			return
		}

		if isExistHandler(w, r, err) {
			return
		}
	}
}

func notFoundHandler(w http.ResponseWriter, r *http.Request, err any) bool {
	exc, ok := err.(exception.NotFoundException)

	if ok {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(404)

		_, err := fmt.Fprintf(w, string(helper.ToJSON(web.DefaultResponse[any]{
			Code:    http.StatusNotFound,
			Message: exc.Message,
			Data:    nil,
		})))

		if err != nil {
			panic(err)
		}
	}

	return ok
}

func isExistHandler(w http.ResponseWriter, r *http.Request, err any) bool {
	exc, ok := err.(exception.IsExistException)
	if ok {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(400)

		_, err := fmt.Fprintf(w, string(helper.ToJSON(web.DefaultResponse[any]{
			Code:    http.StatusBadRequest,
			Message: exc.Message,
			Data:    nil,
		})))

		if err != nil {
			panic(err)
		}
	}

	return ok
}
