import express from 'express'
import "reflect-metadata";
import { InversifyExpressServer } from 'inversify-express-utils'

import { Application } from './Abstractions/Abstracted-Application'
import { container } from './Di-Container'
import { IDatabaseService } from 'Domain/Abstractions/IDatabaseService'
import { DatabaseService } from 'Persistence/DatabaseService'

const TYPES = {
    Warrior: Symbol.for("IDatabaseService"),
    Weapon: Symbol.for("Weapon"),
    ThrowableWeapon: Symbol.for("ThrowableWeapon")
};
export { TYPES };

export class App extends Application {
  async setup() {
    const _db = await container.resolve<IDatabaseService>(DatabaseService);

    let router = express.Router({
        caseSensitive: false,
        mergeParams: false,
        strict: false
    });

    const server = new InversifyExpressServer(container, router)

    server.setConfig((app) => {
      app.use(express.json())
    })

    const app = server.build()

    app.listen(process.env.PORT, () => {
      console.log(
        `server is running on http://localhost:${process.env.PORT}`
      )
    })
  }
}