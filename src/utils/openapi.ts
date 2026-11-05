import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registerInstituicaoPaths } from "../modules/instituicao/instituicao.openapi";
import { registerAnimalPaths } from "../modules/animal/animal.openapi";
import { registerVacinaPaths } from "../modules/vacina/vacina.openapi";
import { registerAnimalVacinaPaths } from "../modules/animal-vacina/animal-vacina.openapi";
import { registerAdotantePaths } from "../modules/adotante/adotante.openapi";
import { registerMatchPaths } from "../modules/match/match.openapi";

const registry = new OpenAPIRegistry();
registerInstituicaoPaths(registry);
registerAnimalPaths(registry);
registerVacinaPaths(registry);
registerAnimalVacinaPaths(registry);
registerAdotantePaths(registry);
registerMatchPaths(registry);
const generator = new OpenApiGeneratorV3(registry.definitions);
export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: { title: "Match Adotivo API", version: "1.0.0", description: "API de adoção de animais – DAW II" },
  servers: [{ url: "http://localhost:3000", description: "Desenvolvimento local" }],
});
