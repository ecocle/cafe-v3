import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await signInUser(values);

            if (response.ok) {
                const responseData = await response.json();
                const token = responseData.token;
                Cookies.set("token", token);

                navigate("/");
                window.location.reload();
            } else {
                handleErrorResponse(response);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const signInUser = async (credentials: {
        username: string;
        password: string;
    }) => {
        return await fetch(`${baseUrl}/api/signIn`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    };

    const handleErrorResponse = (response: Response) => {
        setIsSubmitting(false);

        if (response.status === 401) {
            setError("Incorrect username or password");
        } else {
            setError(`Error: ${response.statusText}`);
        }
    };

    const handleError = (error: any) => {
        setIsSubmitting(false);
        setError(
            `Error: ${error.message || "Something went wrong, please try again later"}`,
        );
        console.error("Error during sign-in:", error);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-4 w-11/12 max-w-md p-6"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            Sign in to your account to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="johndoe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            type="password"
                                            placeholder="12345"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            variant={error ? "destructive" : "default"}
                            className="w-full"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {error ? (
                                <span className="text-destructive-foreground">
                                    {error}
                                </span>
                            ) : isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    <span className="ml-2">Signing In...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <FormDescription className="text-center">
                            Don't have an account?{" "}
                            <Link className="text-primary" to="/sign-up">
                                Sign Up
                            </Link>
                        </FormDescription>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};

export default SignIn;
