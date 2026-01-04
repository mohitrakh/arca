import { OrgRole, ProjectRole } from "../../constants/roles";

declare global {
    namespace Express {
        interface Request {
            auth?: {
                userId: string;
            };
            org?: {
                id: string;
                role?: OrgRole;
            };
            project?: {
                id: string;
                role?: ProjectRole;
            };
        }
    }
}