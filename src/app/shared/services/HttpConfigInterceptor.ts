import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "./login/login.service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private authService: LoginService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.tokenHasExpired()) this.authService.logout();

    // This is my helper method to fetch the data from localStorage.
    const token: string = this.authService.getToken();
    if (request.url.includes(environment.API_URL) && request.url.includes("auth/login")) return next.handle(request);

    if (request.url.includes(environment.API_URL)) {
      const params = request.params;
      let headers = request.headers;

      if (token) {
        headers = headers.set("Authorization", `Bearer ${token}`);
      } else {
        this.router.navigate(["/login"]);
      }

      request = request.clone({
        params,
        headers,
      });
    }

    return next.handle(request);
  }
}
