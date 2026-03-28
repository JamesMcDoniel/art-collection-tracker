# To Start Project:

- Open both the `frontend` and `backend` folders in separate terminal instances.
- In `frontend`, issue the command `npm i` to install dependencies, then `npm run dev` to start the local development server.
- In `backend`, issue the command `dotnet ef database update` to generate the database, then `dotnet restore` to install dependencies, finally `dotnet run` to build and run the server.
- Install `ResNet50-v1-7.onnx` model, found here: https://github.com/onnx/models/blob/main/validated/vision/classification/resnet/model/resnet50-v1-7.onnx, and place it in the `/backend/Models` folder.

<hr />

# Environment Variables / Secrets

This project uses a few environment variables. As such, it already has a user-secrets id associated with the project. User-Secrets is a store for keeping secrets during development.

For development / demoing, the values provided for JWT environment variables isn't important. Each property requires a string, and that's all that matters for now. Replace my placeholder `<string>`, including the angle brackets, with anything.

Enter the following in the terminal, while in the `/backend` directory:

`dotnet user-secrets set "Jwt:Key" "<string>"`

`dotnet user-secrets set "Jwt:Issuer" "<string>"`

`dotnet user-secrets set "Jwt:Audience" "<string>"`

In production, they will be added as environment variables like `JWT__KEY`, etc. or into the secrets vault of your favorite cloud hosting platform.

MailSettings:Server

- [STRING] Depends on your provider, "smtp.office365.com" for Microsoft 365, or "smtp.gmail.com" for google.

MailSettings:Port

- [INTEGER] The accompanying port for the selected server, I think both use 587

MailSettings:SenderName

- [STRING] This is who the email shows up as, i.e. "Tech Support", etc.

MailSettings:SenderEmail

- [STRING] This is the email address that the email comes from.

MailSettings:AppPassword

- [STRING] I'm sure MS365 is the same, but you can't use plain passwords with gmail anymore, instead you have to generate a 16-character App Password and use that instead.

AppSettings:ClientURL

- [STRING] This is the domain / URL of the frontend. i.e. "https://example.com"
