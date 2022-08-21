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

		createSuccessResponse(w, r, response, http.StatusOK)
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

		createSuccessResponse(w, r, response, http.StatusOK)

	default:
		createFailedResponse(w, r, "Url path not found", nil, http.StatusBadGateway)
	}
}

func errorHandler(w http.ResponseWriter, r *http.Request) {
	err := recover()

	if err != nil {
		if validationHandler(w, r, err) {
			return
		}

		if notFoundHandler(w, r, err) {
			return
		}

		if isExistHandler(w, r, err) {
			return
		}

		createFailedResponse(w, r, "Internal server error", nil, http.StatusInternalServerError)
	}
}

func validationHandler(w http.ResponseWriter, r *http.Request, err any) bool {
	exc, ok := err.(exception.ValidationException)

	if ok {
		createFailedResponse(w, r, exc.Message, nil, http.StatusBadRequest)
	}

	return ok
}

func notFoundHandler(w http.ResponseWriter, r *http.Request, err any) bool {
	exc, ok := err.(exception.NotFoundException)

	if ok {
		createFailedResponse(w, r, exc.Message, nil, http.StatusNotFound)
	}

	return ok
}

func isExistHandler(w http.ResponseWriter, r *http.Request, err any) bool {
	exc, ok := err.(exception.IsExistException)
	if ok {
		createFailedResponse(w, r, exc.Message, nil, http.StatusBadRequest)
	}

	return ok
}

func createFailedResponse(w http.ResponseWriter, r *http.Request, message string, data any, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "https://shortener.mohamadrishwan.me")
	w.WriteHeader(code)

	_, err := fmt.Fprintf(w, string(helper.ToJSON(web.DefaultResponse[any]{
		Code:    code,
		Message: message,
		Data:    data,
	})))

	if err != nil {
		panic(err)
	}
}

func createSuccessResponse(w http.ResponseWriter, r *http.Request, response any, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "https://shortener.mohamadrishwan.me")
	w.WriteHeader(code)

	_, err := fmt.Fprintf(w, string(helper.ToJSON(response)))

	if err != nil {
		panic(err)
	}
}
